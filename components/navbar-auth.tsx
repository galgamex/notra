'use client';

import { LogOut, Settings, Shield } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
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

export default function NavbarAuth() {
	const { data: session, status } = useSession();
	const t = useTranslations('components_navbar_auth');
	const isDark = useIsDark();
	const mounted = useMounted();
	const router = useRouter();

	const handleSettings = () => {
		router.push('/admin/settings');
	};

	const handleAdmin = () => {
		router.push('/admin');
	};

	const handleLogout = () => {
		signOut();
	};

	const handleLogin = () => {
		router.push('/login');
	};

	// 加载中状态
	if (status === 'loading') {
		return <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>;
	}

	// 未登录状态 - 显示登录按钮
	if (!session?.user) {
		return (
			<Button size="sm" variant="outline" onClick={handleLogin}>
				{t('login')}
			</Button>
		);
	}

	// 已登录状态 - 显示用户头像和下拉菜单
	const user = session.user as {
		role?: string;
		avatar?: string;
		name?: string;
		username?: string;
	};
	const isAdmin = user?.role === 'ADMIN';

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<div className="cursor-pointer rounded-full p-1 transition-colors hover:bg-accent">
					<div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
						<Image
							fill
							alt="用户头像"
							className="object-cover"
							sizes="32px"
							src={
								user?.avatar ||
								(mounted ? (isDark ? DEFAULT_ACCOUNT_AVATAR_DARK : DEFAULT_ACCOUNT_AVATAR) : DEFAULT_ACCOUNT_AVATAR)
							}
						/>
					</div>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<div className="px-2 py-1.5 text-sm font-medium">
					{user?.name || user?.username || t('user')}
				</div>

				<DropdownMenuSeparator />

				{isAdmin && (
					<>
						<DropdownMenuItem onClick={handleAdmin}>
							<Shield className="mr-2 h-4 w-4" />
							{t('admin_panel')}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuItem onClick={handleSettings}>
					<Settings className="mr-2 h-4 w-4" />
					{t('settings')}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<ThemeRadioGroup />

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						{t('log_out')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
