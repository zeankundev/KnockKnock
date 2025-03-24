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
## Current method
- Create a JSON file. Populate it with these as the content
```json
[
    {
        "name": "Character name",
        "tag": "character-tag",
        "profilePicture": "profile-picture-url",
        "geminiToken": "AIstudio-token-here-xxx",
        "trainingData": "training data here"
    }
]
```
You can add as much contacts as you want. Imagination is your only limit. Just make sure the tags don't have the same name
```json
[
    {
        "name": "Character 1",
        "tag": "character-one",
        "profilePicture": "profile-picture-url",
        "geminiToken": "AIstudio-token-here-xxx",
        "trainingData": "training data here"
    },
    {
        "name": "Character 2",
        "tag": "character-two",
        "profilePicture": "profile-picture-url",
        "geminiToken": "AIstudio-token-here-xxx",
        "trainingData": "training data here"
    },
]
```
- Host your JSON somewhere on the internet. Ignore GitGuardian emails (because you're going to add your token here, if hosted publicly and you don't have a local CDN)
- Create an `.env` file and populate the following contents with this:
```
EXPO_PUBLIC_CONTACT_INFO_JSON=<JSON you hosted here>
```
- Rebuild it (this could be done by `Ctrl+C` followed by `yarn start`)
- Voila! You're finished!
## Deprecated method
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