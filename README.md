# マメナカタ (Mamenakata) - 接待補佐パーソナルアシスタント

"気が利く"を、誰でも持てるスキルに。人間関係のプロトコルを、AIが整えてくれる接待補佐パーソナルアシスタント。

## 概要

マメナカタは、人付き合いの心理的ハードルを取り除くためのAI秘書です。ただのリマインダーではなく、"今なにをすべきか、あえて何もしないべきか"を判断し提案する新時代の接待支援AIです。

## 主な機能

- 🎴 **カルテ管理**: 名前・生年月日・趣味などの登録（美容室や飲食店レベルの顧客情報を蓄積）
- 🗓️ **イベント管理**: 誕生日・記念日・出産・法事などの通知（関係性・頻度・過去履歴に基づき通知と対応提案）
- 🎁 **贈答支援**: ギフト提案・お返しの判断（相手の嗜好・関係性に応じたギフト候補を自動表示）
- 🍽️ **店舗選定**: 食事の誘い・会食の提案（行動範囲・会話ログから好みを分析し提案）
- 💬 **会話支援**: 前回会話のリマインド、話題提案（「娘さんサッカー続いてますか？」など、心に残る会話を演出）
- 🤖 **AI自動判断**: 「あえて何もしない」戦略も提案（疎遠判断・負担軽減・距離感コントロールもサポート）

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS
- **バックエンド**: FastAPI + SQLite (開発用データベース)

## セットアップ手順

### 前提条件

- Node.js 18以上
- Python 3.9以上
- Poetry (Pythonパッケージマネージャー)

### バックエンドのセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/mutsu-6/PAI.git
cd PAI/backend

# 依存関係のインストール
poetry install

# 開発サーバーの起動
poetry run uvicorn app.main:app --reload
```

バックエンドサーバーは http://localhost:8000 で起動します。
API ドキュメントは http://localhost:8000/docs で確認できます。

### フロントエンドのセットアップ

```bash
# リポジトリのクローン（バックエンドと別のターミナルで）
cd PAI/frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

## 対象ユーザー

- 接待・付き合いの多いビジネスパーソン
- 会食が多い経営者・営業職
- カウンター主体の飲食店や美容室オーナー
- プライベートで人付き合いが多い方

## 今後の展望

- LINE・Google連携、ギフトEC連携
- 会話からの自動情報抽出（LLM連携強化）
- 自動メッセージ送信／ギフト購入自動化

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。

---

# Mamenakata - Hospitality Support Personal Assistant

"Making thoughtfulness a skill anyone can possess." An AI secretary that manages human relationship protocols.

## Overview

Mamenakata is an AI secretary designed to remove the psychological barriers of social interactions. It's not just a reminder, but a next-generation hospitality support AI that judges and suggests "what to do now, or what not to do."

## Main Features

- 🎴 **Contact Management**: Register names, birthdays, hobbies, etc. (accumulate customer information at the level of beauty salons and restaurants)
- 🗓️ **Event Management**: Notifications for birthdays, anniversaries, childbirths, memorial services, etc. (notifications and response suggestions based on relationships, frequency, and past history)
- 🎁 **Gift Support**: Gift suggestions and return gift judgments (automatically display gift candidates according to the other person's preferences and relationship)
- 🍽️ **Restaurant Selection**: Meal invitations and meeting suggestions (analyze preferences from activity range and conversation logs and make suggestions)
- 💬 **Conversation Support**: Remind previous conversations, suggest topics ("Is your daughter still playing soccer?" etc., creating memorable conversations)
- 🤖 **AI Automatic Judgment**: Also suggests "deliberately do nothing" strategies (supports distant judgment, burden reduction, and relationship distance control)

## Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLite (development database)

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Python 3.9 or higher
- Poetry (Python package manager)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/mutsu-6/PAI.git
cd PAI/backend

# Install dependencies
poetry install

# Start the development server
poetry run uvicorn app.main:app --reload
```

The backend server will start at http://localhost:8000.
API documentation can be viewed at http://localhost:8000/docs.

### Frontend Setup

```bash
# Clone the repository (in a separate terminal from the backend)
cd PAI/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at http://localhost:5173.

## Target Users

- Business people with many hospitality and social obligations
- Executives and sales professionals who have many business meals
- Counter-based restaurant and beauty salon owners
- People with many social connections in their private lives

## Future Prospects

- LINE & Google integration, gift EC integration
- Automatic information extraction from conversations (enhanced LLM integration)
- Automated message sending / gift purchase automation

## License

This project is released under the [MIT License](LICENSE).
