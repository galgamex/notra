'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';

import { createBook } from '@/actions/book';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/i18n';
import { CreateBookFormValues, CreateBookFormSchema } from '@/types/book';

export type CreateBookFormProps = PropsWithChildren;

export default function CreateBookForm({
	children
}: Readonly<CreateBookFormProps>) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const t = useTranslations('app_dashboard_sidebar');

	const form = useForm<CreateBookFormValues>({
		resolver: zodResolver(CreateBookFormSchema),
		defaultValues: {
			name: ''
		}
	});

	const onSubmit = (values: CreateBookFormValues) => {
		startTransition(async () => {
			const result = await createBook(values);

			if (result.success) {
				mutate('/api/books');
				toast.success(t('create_success'));
				setOpen(false);
				form.reset();
				router.push(`/dashboard/${result.data?.slug}`);
			} else {
				toast.error(result.message);
			}
		});
	};

	const isDisabled = form.watch('name') === '';

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children ?? (
					<Button
						className="h-7 w-7 cursor-pointer"
						size="icon"
						variant="ghost"
					>
						<Plus />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent
				aria-describedby={undefined}
				className="sm:max-w-md"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{t('new_book')}</DialogTitle>
				</DialogHeader>

				<div className="mt-4">
					<Form {...form}>
						<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className="h-10"
												disabled={isPending}
												placeholder={t('name_placeholder')}
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<SubmitButton
								className="h-10"
								disabled={isDisabled}
								isPending={isPending}
							>
								{t('create')}
							</SubmitButton>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
