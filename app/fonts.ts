import localFont from 'next/font/local';

export const nippo = localFont({
  src: './fonts/nippo/Nippo-Variable.woff2',
  variable: '--font-nippo',
  display: 'swap',
});

export const zodiak = localFont({
  src: [
    {
      path: './fonts/zodiak/Zodiak-Variable.woff2',
      style: 'normal',
    },
    {
      path: './fonts/zodiak/Zodiak-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-zodiak',
  display: 'swap',
});
