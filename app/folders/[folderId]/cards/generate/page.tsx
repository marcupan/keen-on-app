'use client';

import React, { useState } from 'react';

import { useParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import ApiErrorValidationSchema from '@/validations/errors';

const GenerateCardSchema = z.object({
	word: z.string().min(1, 'Word is required'),
	imageBase64: z.string().min(1, 'Image selection is required'),
});

type GenerateCardValues = z.infer<typeof GenerateCardSchema>;

type GenerateCardResponse = {
	status: string;
	data: {
		image: string;
		translation: string;
		characterBreakdown: string[];
		exampleSentences: string[];
	};
};

type GeneratedData = {
	image: string;
	translation: string;
	characterBreakdown: string[];
	exampleSentences: string[];
};

export default function GenerateCardPage() {
	const params = useParams();

	const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
		null
	);

	const generateMutation = useMutation<
		GenerateCardResponse,
		Error,
		GenerateCardValues
	>({
		mutationFn: async (values: GenerateCardValues) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards/generate`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',

					body: JSON.stringify(values),
				}
			);

			if (!res.ok) {
				let errorMessage = 'Error generating card';

				try {
					const errorData = await res.json();
					const parsedError =
						ApiErrorValidationSchema.parse(errorData);
					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {
					errorMessage = `Error: ${res.status} ${res.statusText}`;
				}
				throw new Error(errorMessage);
			}

			return res.json() as Promise<GenerateCardResponse>;
		},
		onSuccess: (response) => {
			const { data, status } = response;
			console.log('Generated card data received:', data, status);

			if (status === 'success' && data) {
				setGeneratedData(data);
			} else {
				setGeneratedData(null);
				console.warn(
					'Generation response status was not "success":',
					status
				);
			}
		},
		onError: (error) => {
			console.error('Generation mutation failed:', error);
			setGeneratedData(null);
		},
	});

	const createCardMutation = useMutation<
		unknown,
		Error,
		{
			body: {
				word: string;
				translation: string;
				image: string;
				sentence: string;
				folderId?: string;
			};
		}
	>({
		mutationFn: async (cardPayload) => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/cards`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify(cardPayload.body),
				}
			);

			if (!res.ok) {
				let errorMessage = 'Error creating card';

				try {
					const errorData = await res.json();
					const parsedError =
						ApiErrorValidationSchema.parse(errorData);
					errorMessage = parsedError.errors
						.map((err) => err.message)
						.join(', ');
				} catch {
					errorMessage = `Error: ${res.status} ${res.statusText}`;
				}
				throw new Error(errorMessage);
			}

			return res.json();
		},
		onSuccess: (data) => {
			console.log('Card created successfully', data);

			setGeneratedData(null);
			form.reset();
		},
		onError: (error) => {
			console.error('Create card mutation failed:', error);
		},
	});

	const form = useForm({
		defaultValues: {
			word: '',
			imageBase64: '',
		},
		validators: {
			onChange: GenerateCardSchema,
		},
		onSubmit: async ({ value }) => {
			setGeneratedData(null);
			await generateMutation.mutateAsync(value);
		},
	});

	function TextInput({
		label,
		name,
	}: {
		label: string;
		name: keyof GenerateCardValues;
	}) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label
							htmlFor={field.name}
							className="block text-sm font-medium mb-1"
						>
							{label}
						</label>
						<input
							id={field.name}
							name={field.name}
							type="text"
							value={field.state.value}
							className="border p-2 w-full rounded shadow-sm"
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							aria-invalid={field.state.meta.errors.length > 0}
							aria-describedby={
								field.state.meta.errors.length > 0
									? `${field.name}-errors`
									: undefined
							}
						/>

						{field.state.meta.errors.length > 0 && (
							<div
								id={`${field.name}-errors`}
								className="text-red-600 text-sm mt-1"
							>
								{field.state.meta.errors.join(', ')}
							</div>
						)}
					</div>
				)}
			</form.Field>
		);
	}

	function FileInput({
		label,
		name,
	}: {
		label: string;
		name: keyof GenerateCardValues;
	}) {
		return (
			<form.Field name={name}>
				{(field) => (
					<div className="mb-4">
						<label
							htmlFor={field.name}
							className="block text-sm font-medium mb-1"
						>
							{label}
						</label>
						<input
							id={field.name}
							type="file"
							accept="image/png, image/jpeg, image/webp"
							className="border p-2 w-full rounded shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							onBlur={field.handleBlur}
							onChange={(ev) => {
								const file = ev.target.files?.[0];

								if (file) {
									const reader = new FileReader();

									reader.onloadend = () => {
										const result = reader.result as string;

										field.handleChange(result);
									};

									reader.onerror = () => {
										console.error('Error reading file');
										field.handleChange('');
									};

									reader.readAsDataURL(file);
								} else {
									field.handleChange('');
								}
							}}
							aria-invalid={field.state.meta.errors.length > 0}
							aria-describedby={
								field.state.meta.errors.length > 0
									? `${field.name}-errors`
									: undefined
							}
						/>
						{field.state.meta.errors.length > 0 && (
							<div
								id={`${field.name}-errors`}
								className="text-red-600 text-sm mt-1"
							>
								{field.state.meta.errors.join(', ')}
							</div>
						)}
					</div>
				)}
			</form.Field>
		);
	}

	const handleCreateCard = async () => {
		if (!generatedData || typeof params.folderId !== 'string') {
			console.error(
				'Cannot create card: Missing generated data or folder ID.'
			);

			return;
		}

		const cardPayload = {
			body: {
				word: form.state.values.word,
				translation: generatedData.translation,
				image: generatedData.image,

				sentence: generatedData.exampleSentences.join('\n'),
				folderId: params.folderId,
			},
		};

		await createCardMutation.mutateAsync(cardPayload);
	};

	return (
		<div className="flex flex-col md:flex-row max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6 border border-gray-200">
			<div className="md:w-1/2 md:pr-6">
				<h1 className="text-2xl font-semibold mb-6 text-gray-800">
					Generate Flashcard
				</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();

						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<TextInput label="Chinese Word" name="word" />
					<FileInput label="Source Image" name="imageBase64" />
					<form.Subscribe
						selector={(state) => [
							state.canSubmit,
							state.isSubmitting,
						]}
					>
						{([canSubmit, isSubmitting]) => (
							<button
								type="submit"
								disabled={
									!canSubmit ||
									isSubmitting ||
									generateMutation.isPending
								}
								className="w-full px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
							>
								{generateMutation.isPending
									? 'Generating...'
									: 'Generate Card Preview'}
							</button>
						)}
					</form.Subscribe>
				</form>

				{generateMutation.isError && (
					<p className="text-red-600 mt-3 text-sm">
						Failed to generate:{' '}
						{(generateMutation.error as Error).message}
					</p>
				)}
			</div>

			<div className="md:w-1/2 md:pl-6 mt-8 md:mt-0 md:border-l md:border-gray-200">
				<h2 className="text-xl font-semibold mb-4 text-gray-700">
					Preview
				</h2>
				{generateMutation.isPending && (
					<p className="text-gray-500">Generating preview...</p>
				)}
				{generatedData && !generateMutation.isPending && (
					<div className="space-y-3 p-4 border rounded bg-white">
						<div className="mb-2">
							<strong className="text-gray-600">Word:</strong>
							<span className="ml-2 text-gray-800">
								{form.state.values.word}
							</span>
						</div>

						<div className="mb-2">
							<strong className="text-gray-600">
								Translation:
							</strong>
							<span className="ml-2 text-gray-800">
								{generatedData.translation}
							</span>
						</div>

						{generatedData.characterBreakdown &&
							generatedData.characterBreakdown.length > 0 && (
								<div className="mb-2">
									<strong className="text-gray-600">
										Breakdown:
									</strong>
									<ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
										{generatedData.characterBreakdown.map(
											(line, index) => (
												<li key={`breakdown-${index}`}>
													{line}
												</li>
											)
										)}
									</ul>
								</div>
							)}

						{generatedData.exampleSentences &&
							generatedData.exampleSentences.length > 0 && (
								<div className="mb-2">
									<strong className="text-gray-600">
										Examples:
									</strong>
									<ul className="list-disc ml-5 mt-1 text-sm text-gray-700">
										{generatedData.exampleSentences.map(
											(line, index) => (
												<li key={`example-${index}`}>
													{line}
												</li>
											)
										)}
									</ul>
								</div>
							)}

						<div className="mb-2">
							<strong className="text-gray-600">
								Generated Image:
							</strong>
							<div className="mt-2 border rounded overflow-hidden">
								<img
									src={generatedData.image}
									alt={`Generated card for ${form.state.values.word}`}
									className="w-full object-contain"
								/>
							</div>
						</div>

						<button
							onClick={handleCreateCard}
							disabled={
								createCardMutation.isPending || !params.folderId
							}
							className="w-full px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out mt-4"
							title={
								!params.folderId
									? 'Cannot create card without a folder context'
									: ''
							}
						>
							{createCardMutation.isPending
								? 'Saving...'
								: 'Save Card to Folder'}
						</button>

						{createCardMutation.isError && (
							<p className="text-red-600 mt-3 text-sm">
								Failed to save:{' '}
								{(createCardMutation.error as Error).message}
							</p>
						)}
					</div>
				)}

				{!generatedData && !generateMutation.isPending && (
					<p className="text-gray-500 text-center mt-10">
						Generate a card preview using the form on the left.
					</p>
				)}
			</div>
		</div>
	);
}
