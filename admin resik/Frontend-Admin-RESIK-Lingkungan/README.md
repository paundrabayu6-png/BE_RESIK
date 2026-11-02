This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Menjalankan RESIK Admin

Jalankan backend dan MySQL dari folder `backend` terlebih dahulu. Pastikan database
sudah dimigrasikan (`npm run migrate`) dan data demo tersedia (`npm run seed`).
Atur `NEXT_PUBLIC_API_URL` di `.env.local` ke alamat API backend, misalnya
`http://localhost:5000/api`.

```bash
npm run dev
```

Buka [http://localhost:3000/login](http://localhost:3000/login). Untuk data demo
lokal, gunakan akun admin yang dibuat oleh `backend/src/db/seed.js`.

Validasi produksi:

```bash
npm run lint
npm run build
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
