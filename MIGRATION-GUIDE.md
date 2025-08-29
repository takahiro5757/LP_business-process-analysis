# Next.js + Tailwind CSS 移行ガイド

## 概要
このドキュメントは、現在のHTML/CSSベースのLPをNext.js + Tailwind CSSに移行するためのガイドです。
ノーリグレット設計により、スムーズな移行が可能です。

## アーキテクチャ設計

### 1. デザイントークン
CSS変数として定義されているデザイントークンは、Tailwind設定に直接マッピング可能です。

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4A5BF6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#8B5CF6',
          600: '#7c3aed',
        },
        accent: '#FFC107',
      },
    },
  },
}
```

### 2. コンポーネント構造

現在のHTML構造は、以下のReactコンポーネントに分割可能です：

```
components/
├── layout/
│   ├── Header.tsx
│   └── Footer.tsx
├── sections/
│   ├── Hero.tsx
│   ├── ServiceFlow.tsx
│   ├── ThreeStep.tsx
│   ├── Issues.tsx
│   ├── Benefits.tsx
│   ├── Pricing.tsx
│   └── Contact.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Form.tsx
│   └── Section.tsx
└── common/
    ├── Container.tsx
    └── Grid.tsx
```

### 3. データ属性マッピング

HTMLのdata属性は、Reactプロパティに変換：

| HTML Data属性 | React Props |
|--------------|------------|
| `data-component="header"` | `<Header />` |
| `data-element="logo"` | `logo` prop |
| `data-action="contact"` | `onClick` handler |
| `data-card="1"` | `id` or `index` prop |

### 4. ユーティリティクラスマッピング

現在のユーティリティクラスは、Tailwindクラスに1対1でマッピング：

| Custom Class | Tailwind Class |
|-------------|---------------|
| `.flex` | `flex` |
| `.grid` | `grid` |
| `.text-center` | `text-center` |
| `.bg-primary` | `bg-primary-500` |
| `.shadow-md` | `shadow-md` |

### 5. コンポーネント例

#### Button Component
```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'white';
  size?: 'normal' | 'large';
  fullWidth?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'normal', 
  fullWidth = false,
  className,
  children,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-block font-medium rounded-md transition-all duration-300',
        {
          'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
          'bg-white text-primary-500 hover:scale-105': variant === 'white',
          'px-6 py-3': size === 'normal',
          'px-10 py-4 text-lg': size === 'large',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Card Component
```tsx
// components/ui/Card.tsx
interface CardProps {
  icon?: string | number;
  title: string;
  description: string;
  className?: string;
}

export const Card = ({ icon, title, description, className }: CardProps) => {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}>
      {icon && (
        <div className="w-15 h-15 mx-auto mb-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
};
```

### 6. フォームデータ処理

```tsx
// hooks/useContactForm.ts
import { useState } from 'react';

interface FormData {
  company: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  inquiryType?: string;
  message?: string;
}

export const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    name: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // API呼び出し
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      // 成功処理
    }
  };

  return { formData, setFormData, handleSubmit };
};
```

### 7. 移行手順

1. **Next.jsプロジェクトの初期化**
   ```bash
   npx create-next-app@latest dx-business-lp --typescript --tailwind
   cd dx-business-lp
   ```

2. **必要なパッケージのインストール**
   ```bash
   npm install clsx framer-motion @heroicons/react
   ```

3. **Tailwind設定の更新**
   - `tailwind.config.js`にデザイントークンを追加

4. **コンポーネントの作成**
   - 各セクションを個別のコンポーネントに分割
   - data属性をpropsに変換

5. **画像の最適化**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src="/image/hero/DSC03121-2.jpg" 
     alt="業務コンサルタント"
     width={600}
     height={400}
     priority
   />
   ```

6. **APIルートの作成**
   ```tsx
   // pages/api/contact.ts
   export default async function handler(req, res) {
     if (req.method === 'POST') {
       // フォーム処理
       res.status(200).json({ success: true });
     }
   }
   ```

### 8. パフォーマンス最適化

- **Code Splitting**: 各セクションを動的インポート
- **Image Optimization**: Next.js Imageコンポーネント使用
- **Font Optimization**: Next.js Font最適化
- **CSS**: Tailwind CSSのPurge設定

### 9. SEO対応

```tsx
// components/SEO.tsx
import Head from 'next/head';

export const SEO = () => (
  <Head>
    <title>業務整理LP - Festal</title>
    <meta name="description" content="業務現場のプロが業務課題を解決します" />
    <meta property="og:title" content="業務整理LP - Festal" />
    <meta property="og:description" content="業務現場のプロが業務課題を解決します" />
  </Head>
);
```

## まとめ

この設計により、以下が実現されています：

1. **再利用性**: コンポーネントベースの設計
2. **保守性**: 明確な構造とデザイントークン
3. **拡張性**: 新機能の追加が容易
4. **パフォーマンス**: 最適化の準備完了
5. **型安全性**: TypeScript対応の準備

移行時の作業量を最小化し、リスクを低減する設計となっています。