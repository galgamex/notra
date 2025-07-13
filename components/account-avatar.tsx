'use client';

import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	DEFAULT_ACCOUNT_AVATAR,
	DEFAULT_ACCOUNT_AVATAR_DARK
} from '@/constants/default';
import { useIsDark } from '@/hooks/use-is-dark';
import { useMounted } from '@/hooks/use-mounted';
import { useTranslations } from '@/i18n';

import ThemeRadioGroup from './theme-radio-group';

export default function AccountAvatar() {
	const t = useTranslations('app_dashboard_account_avatar');
	const isDark = useIsDark();
	const mounted = useMounted();
	const router = useRouter();

	const handleSettings = () => {
		router.push('/admin/settings');
	};

	const handleLogout = () => {
		signOut();
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<div className="cursor-pointer rounded-sm px-1.5 py-1 hover:bg-accent">
					<Image
						alt="Account Avatar"
						height={24}
						src={mounted ? (isDark ? DEFAULT_ACCOUNT_AVATAR_DARK : DEFAULT_ACCOUNT_AVATAR) : DEFAULT_ACCOUNT_AVATAR}
						width={24}
					/>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem onClick={handleSettings}>
					<Settings />
					{t('settings')}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<ThemeRadioGroup />

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut />
						{t('log_out')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
