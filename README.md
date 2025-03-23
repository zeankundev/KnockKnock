# Knock Knock
A beta messaging app made with Expo/React Native. Still a work-in-progress. Totally inspired off ZZZ. Not production-ready, aka unfinished.

# Usage
You will need:
- Node >v22
- Expo Go on your phone

Steps:
- Clone this repository.
```
git clone https://github.com/zeankundev/KnockKnock
```
- `cd` into the directory and install all dependencies
```
cd KnockKnock
yarn
```
- Start and have fun!
```
yarn start
```
Note: this page may get updated over time as the project grows.

# WIP stuff
Adding AI feature (so you don't get lonely while debugging, at least you'd have company :v)
- Create a file called `AISettings.ts` in `components/config` (it's gitignored by default)
- Head to [AI Studio](https://aistudio.google.com) and craft a new token.
- Enter these contents onto `AISettings.ts`
```ts
export default {
    name: 'name here',
    tag: 'tag-here',
    profilePicture: 'pfp-url-here',
    geminiToken: 'AItoken-here-xxx',
    trainingData:
    `
    Training data here. Insert what you want your character to say or feel.
    `
}
```
Enter the name, tag, profile picture URL, your AI Studio token, and your training data. The training data is up to you: just express your creativity. Keep fine-tuning it until you get the perfect results!