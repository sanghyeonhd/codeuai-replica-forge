
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					50: 'rgba(147, 112, 219, 0.05)',
					100: 'rgba(147, 112, 219, 0.1)',
					200: 'rgba(147, 112, 219, 0.2)',
					300: 'rgba(147, 112, 219, 0.3)',
					400: 'rgba(147, 112, 219, 0.4)',
					500: 'rgba(147, 112, 219, 0.5)',
					600: 'rgba(147, 112, 219, 0.6)',
					700: 'rgba(147, 112, 219, 0.7)',
					800: 'rgba(147, 112, 219, 0.8)',
					900: 'rgba(147, 112, 219, 0.9)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				alpha: {
					white: {
						'5': 'rgba(255, 255, 255, 0.05)',
						'10': 'rgba(255, 255, 255, 0.1)',
						'20': 'rgba(255, 255, 255, 0.2)',
						'50': 'rgba(255, 255, 255, 0.5)',
						'80': 'rgba(255, 255, 255, 0.8)',
					},
					gray: {
						'2': 'rgba(128, 128, 128, 0.02)',
						'5': 'rgba(128, 128, 128, 0.05)',
						'10': 'rgba(128, 128, 128, 0.1)',
						'20': 'rgba(128, 128, 128, 0.2)',
						'30': 'rgba(128, 128, 128, 0.3)',
						'50': 'rgba(128, 128, 128, 0.5)',
						'80': 'rgba(128, 128, 128, 0.8)',
					},
					accent: {
						'10': 'rgba(147, 112, 219, 0.1)',
						'20': 'rgba(147, 112, 219, 0.2)',
						'30': 'rgba(147, 112, 219, 0.3)',
					},
					red: {
						'10': 'rgba(239, 68, 68, 0.1)',
						'20': 'rgba(239, 68, 68, 0.2)',
					},
				},
				'bolt-elements': {
					borderColor: 'var(--bolt-elements-borderColor)',
					borderColorActive: 'var(--bolt-elements-borderColorActive)',
					textPrimary: 'var(--bolt-elements-textPrimary)',
					textSecondary: 'var(--bolt-elements-textSecondary)',
					textTertiary: 'var(--bolt-elements-textTertiary)',
					'background-depth-1': 'var(--bolt-elements-bg-depth-1)',
					'background-depth-2': 'var(--bolt-elements-bg-depth-2)',
					'background-depth-3': 'var(--bolt-elements-bg-depth-3)',
					'background-depth-4': 'var(--bolt-elements-bg-depth-4)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
