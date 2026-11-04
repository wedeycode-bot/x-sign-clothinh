import React from 'react';
import { BRAND_CONFIG } from '@/config/brand';

export const TwitchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

export const InstagramIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TikTokIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.49v-7a8.16 8.16 0 0 0 4.91 1.63V6.86a4.83 4.83 0 0 1-1-.17z" />
  </svg>
);

export const XTwitterIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const YouTubeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const WhatsAppSocialIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.101-.476-.15-.676.15-.2.301-.776.98-.952 1.18-.175.201-.35.226-.651.075-.301-.15-1.272-.469-2.424-1.496-.895-.799-1.5-1.786-1.675-2.087-.175-.301-.019-.464.132-.614.135-.135.301-.35.451-.526.15-.175.2-.301.301-.501.101-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.588-.492-.508-.676-.517-.175-.008-.376-.01-.577-.01-.201 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.11.15.2 2.12 3.238 5.137 4.542.718.31 1.278.496 1.715.635.722.23 1.378.197 1.897.12.578-.087 1.782-.728 2.032-1.431.25-.703.25-1.305.175-1.431-.075-.125-.276-.201-.577-.351zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.174L2 22l4.981-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

export interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  showLabels?: boolean;
  includeWhatsApp?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = 'flex items-center gap-6',
  iconClassName = 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-95',
  showLabels = false,
  includeWhatsApp = true,
}) => {
  const socials = [
    {
      name: 'Twitch',
      href: `https://twitch.tv/${BRAND_CONFIG.socials.twitch || 'xsignclothing'}`,
      icon: TwitchIcon,
    },
    {
      name: 'Instagram',
      href: `https://instagram.com/${BRAND_CONFIG.socials.instagram.replace('@', '')}`,
      icon: InstagramIcon,
    },
    {
      name: 'TikTok',
      href: `https://tiktok.com/@${BRAND_CONFIG.socials.tiktok.replace('@', '')}`,
      icon: TikTokIcon,
    },
    {
      name: 'X (Twitter)',
      href: `https://x.com/${BRAND_CONFIG.socials.twitter.replace('@', '')}`,
      icon: XTwitterIcon,
    },
    {
      name: 'YouTube',
      href: `https://youtube.com/${BRAND_CONFIG.socials.youtube ? (BRAND_CONFIG.socials.youtube.startsWith('@') ? BRAND_CONFIG.socials.youtube : '@' + BRAND_CONFIG.socials.youtube) : '@xsignclothing'}`,
      icon: YouTubeIcon,
    },
    ...(includeWhatsApp
      ? [
          {
            name: 'WhatsApp',
            href: `https://wa.me/${BRAND_CONFIG.whatsappPhoneClean}`,
            icon: WhatsAppSocialIcon,
          },
        ]
      : []),
  ];

  return (
    <div className={className}>
      {socials.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            className={`inline-flex items-center justify-center p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${iconClassName}`}
          >
            <Icon className="w-5 h-5" />
            {showLabels && <span className="ml-2 text-xs font-mono">{s.name}</span>}
          </a>
        );
      })}
    </div>
  );
};
