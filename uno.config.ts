import { colors } from './app/_styles/ThemeColors'

import presetWind4 from '@unocss/preset-wind4';
import presetWebFonts from '@unocss/preset-web-fonts';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';


export default defineConfig({
    // outputToCssLayers: true,
    content: {
        // yoink from both filesystem and build pipeline to fix dev
        filesystem: ['./src/**/*.{jsx,tsx}',
                    './app/**/*.{jsx,tsx}'],
        pipeline: {
            include: [/\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|marko|html|css)($|\?)/],
        },
    },
    theme: {
        colors,
    },
    presets: [
        presetWind4({
            preflights: { 
                theme: { mode: true }, 
            },
        }),
        presetWebFonts({
            provider: 'none',
            fonts: {
                sans: ['Roboto Flex', 'Roboto Flex Local'],
                mono: ['Roboto Mono', 'Roboto Mono Local'],
            },
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
});
