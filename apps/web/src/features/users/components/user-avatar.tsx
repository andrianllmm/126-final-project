import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { getInitials } from '@/shared/lib/get-initials';

type UserAvatarProps = {
  name?: string | null;
  email: string;
  image?: string | null;
  sizeClassName?: string;
  fallbackClassName?: string;
};

export function UserAvatar({
  name,
  email,
  image,
  sizeClassName = 'size-8',
  fallbackClassName = '',
}: UserAvatarProps) {
  return (
    <Avatar className={sizeClassName}>
      <AvatarImage src={image ?? undefined} alt={name ?? 'User'} />
      <AvatarFallback className={fallbackClassName}>
        {getInitials(name, email)}
      </AvatarFallback>
    </Avatar>
  );
}
