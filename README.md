# 音楽プレイヤーアプリ

## デモ

https://kurusime1.web.app/

## GitHub

https://github.com/KOMA2004/kurusime1

---

## 概要

自身が作った楽曲を直感的に再生・操作できるWeb音楽プレイヤーです。
また、楽曲のダウンロードを行えます。
再生状態・シーク操作・音量調整をリアルタイムに反映し、ストレスのない操作感を目指しました。

---

## 制作背景

自身の楽曲をYouTubeやSoundCloudに公開する際、ダウンロードには概要欄を開き外部サイトへ遷移する必要があり、導線の分かりづらさを感じていました。

そこで
「再生からダウンロードまでを一つのページで完結できる状態」
を目指し、本アプリを制作しました。

---

## 主な機能

* 音楽の再生 / 停止
* シークバーによる再生位置変更
* 音量調整
* 楽曲リスト表示
* 楽曲ダウンロード

---

## 技術スタック

* React
* TypeScript
* Chakra UI v3
* Vite
* Firebase Hosting
* Supabase
* Jest
* Testing Library

---

## アーキテクチャ / 設計

### コンポーネント設計

アトミックデザインを参考にし、
コンポーネントを役割ごとに分離し、責務を明確にしました。

```
src/
  components/
    atoms/
    molecules/
    organisms/
  hooks/
  lib/
```

* UIパーツ → components
* Reactに関する状態管理 → hooks
* Reactとは無関係の関数 → lib

ロジックとUIを分離することで可読性・再利用性を向上させています。

---

## 工夫した点

### 1. 状態とUIの分離

カスタムフックを用いて音声状態管理(useAudioState)を分離し、
UIコンポーネントは表示とイベントのみを担当する構造にしました。

---

### 2. シーク操作のバグ解決

スライダー外へドラッグして指を離した際にイベントが取得できず、再生位置が更新されない問題がありました。

そこで

```
window.addEventListener("pointerup", commit)
```

を利用し、スライダー外での操作終了も検知できるようにすることで、バグ修正しました。
なお、removeEventListner('pointerup', commit)をreturnしないとuseEffectが呼び出されるたびに重複してしまうので、
付け加えました。

---

### 3. テスト環境の整備

以下の観点で自動テストを実装しました。

* 楽曲取得後にタイトルが表示されるか
* audio要素へ正しくsrcが設定されるか
* 再生 / 停止の挙動
* シークバー操作の挙動

#### テスト対象

* App
* AudioPlayer
* PauseToggle
* SeekBar

#### 共通ラッパー

Chakra Provider を共通ラッパーとして定義し、
実際のアプリ環境に近い状態でテストできるようにしました。

#### jsdom環境の制約への対応

Jest（jsdom）では一部ブラウザAPIが未実装のため、以下をモックしています。

* ResizeObserver
* IntersectionObserver
* matchMedia
* structuredClone
* HTMLMediaElement

これにより UI ライブラリ利用時でも安定してテストが実行できる環境を構築しました。

---

## 今後の改善

* 楽曲アップロード機能の実装
* Node.js を用いたバックエンドの理解を深める
* テスト設計（モック・副作用）の理解をさらに深める
* 独自ドメインでの公開
* SNS導線の追加
* jestとの互換性が厳しいChakraUIv3から別のコンポーネントに移行する

---

## 最後に

小松 響

kurusime1という名前は「苦しんでなんぼ」という戒めでつけました。
元々はMinecraftというゲームのサーバーを運営するため、Javaを勉強しておりましたが、
フロントエンドをするには向いていないということが分かったため、Reactまで勉強しました。

今後は、自身の作品だけでなくブログ記事なども投稿できるようなWebサイトの構築をしていきたいと考えております。

### この２か月で学んだこと
* Visual Studio Code
* html
* css
* javascript
* typescript
* react
* Firebase Hosting
* Supabase
* vite
* chakra v3
* Styled Component (今回は未使用)
* Jest (発展途上)
* Testing Library (発展途上)
* Github

### これから学ぶこと
* Node.js
* AWS
* chakra v3に代替できるもの
* UIデザインの勉強 (本は購入しました)
* 今まで勉強してきたことをさらにブラッシュアップする
  
