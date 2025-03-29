'use client';

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { z } from 'zod';
import ApiErrorValidationSchema from '@/validations/errors';

const GenerateCardSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	imageBase64: z.string().min(1, 'Image base64 is required'),
});

type GenerateCardValues = z.infer<typeof GenerateCardSchema>;

type GenerateCardResponse = {
	status: string;
	date: {
		image: string;
		translation: string;
		sentence: string[];
	};
};

type GeneratedData = {
	image: string;
	translation: string;
	sentence: string[];
};

export default function GenerateCardPage() {
	const params = useParams();

	const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

	const generateMutation = useMutation<GenerateCardResponse, Error, GenerateCardValues>({
		mutationFn: async (values: GenerateCardValues) => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				let errorMessage = 'Error generating card';
				try {
					const errorData = await res.json();
					const parsedError = ApiErrorValidationSchema.parse(errorData);
					errorMessage = parsedError.errors.map((err) => err.message).join(', ');
				} catch {}
				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: (data) => {
			console.log('Generated card:', data);

			if (data.status === 'success' && data.date) {
				setGeneratedData(data.date);
			}
		},
	});

	// Mutation for creating a card using the generated data and form value
	const createCardMutation = useMutation({
		mutationFn: async (card: { body: { word: string; translation: string; image: string; sentence: string; folderId?: string } }) => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(card),
			});

			if (!res.ok) {
				let errorMessage = 'Error creating card';
				try {
					const errorData = await res.json();
					const parsedError = ApiErrorValidationSchema.parse(errorData);
					errorMessage = parsedError.errors.map((err) => err.message).join(', ');
				} catch {}
				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: (data) => {
			console.log('Card created successfully', data);

			setGeneratedData(null);
			form.reset();
		},
	});

	const form = useForm({
		defaultValues: {
			word: '',
			imageBase64: '',
		},
		validators: { onChange: GenerateCardSchema },
		onSubmit: async ({ value }) => {
			await generateMutation.mutateAsync(value);
		},
	});

	function TextInput({ label, name }: { label: string; name: keyof GenerateCardValues }) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label htmlFor={field.name} className="block text-sm font-medium mb-1">
							{label}
						</label>
						<input
							id={field.name}
							name={field.name}
							type="text"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							className="border p-2 w-full"
						/>
					</div>
				)}
			</form.Field>
		);
	}

	function FileInput({ label, name }: { label: string; name: keyof GenerateCardValues }) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label htmlFor={field.name} className="block text-sm font-medium mb-1">
							{label}
						</label>
						<input
							id={field.name}
							name={field.name}
							type="file"
							accept="image/*"
							className="border p-2 w-full"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const reader = new FileReader();
									reader.onloadend = () => {
										const result = reader.result as string;
										// Remove data URL prefix if present
										const commaIndex = result.indexOf(',');
										const base64String = commaIndex !== -1 ? result.substring(commaIndex + 1) : result;
										field.handleChange(base64String);
									};
									reader.readAsDataURL(file);
								}
							}}
						/>
					</div>
				)}
			</form.Field>
		);
	}

	const handleCreateCard = async () => {
		if (!generatedData || typeof params.folderId !== 'string') return;

		const cardPayload = {
			body: {
				word: form.state.values.word,
				translation: generatedData.translation,
				image: generatedData.image,
				sentence: generatedData.sentence.join('\n'),
				folderId: params.folderId,
			},
		};

		await createCardMutation.mutateAsync(cardPayload);
	};

	return (
		<div className="flex flex-col md:flex-row max-w-4xl mx-auto p-4 bg-white shadow mt-4">
			<div className="md:w-1/2 md:pr-4">
				<h1 className="text-2xl mb-4">Generate Card</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<TextInput label="Word" name="word" />
					<FileInput label="Image" name="imageBase64" />
					<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
						{([canSubmit, isSubmitting]) => (
							<button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="px-4 py-2 bg-blue-600 text-white"
							>
								{isSubmitting ? 'Generating...' : 'Generate Card'}
							</button>
						)}
					</form.Subscribe>
				</form>
				{generateMutation.isError && (
					<p className="text-red-500 mt-2">{(generateMutation.error as Error).message}</p>
				)}
			</div>
			{/* Right: Generated Card Preview and Create Card Button */}
			<div className="md:w-1/2 md:pl-4 mt-8 md:mt-0 border-l">
				{generatedData ? (
					<div>
						<h2 className="text-xl mb-4">Generated Card Preview</h2>
						<div className="mb-2">
							<strong>Word:</strong> {form.state.values.word}
						</div>
						<div className="mb-2">
							<strong>Translation:</strong> {generatedData.translation}
						</div>
						<div className="mb-2">
							<strong>Image:</strong>
							<div className="mt-2">
								<img src={`data:image/jpeg;base64,${generatedData.image}`} alt="Generated" className="w-full" />
							</div>
						</div>
						<div className="mb-2">
							<strong>Sentence:</strong>
							<ul className="list-disc ml-5">
								{generatedData.sentence.map((line, index) => (
									<li key={index}>{line}</li>
								))}
							</ul>
						</div>
						<button onClick={handleCreateCard} className="px-4 py-2 bg-green-600 text-white mt-4">
							{createCardMutation.isPending ? 'Creating...' : 'Create Card'}
						</button>
						{createCardMutation.isError && (
							<p className="text-red-500 mt-2">{(createCardMutation.error as Error).message}</p>
						)}
					</div>
				) : (
					<p>No generated card data yet.</p>
				)}
			</div>
		</div>
	);
}
