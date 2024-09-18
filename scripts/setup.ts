import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

async function setupProject() {
  console.log("Welcome to the project setup script!");

  const questions = [
    "Enter your app name: ",
    "Enter your app slug (lowercase, no spaces): ",
    "Enter your bundle identifier (e.g., com.yourusername.yourappslug): ",
    "Enter your Expo username: ",
    "Enter your EAS project ID (or leave blank): ",
  ];

  const answers = [];

  for (const question of questions) {
    const answer = await new Promise<string>((resolve) => {
      process.stdout.write(question);
      process.stdin.once("data", (data) => {
        resolve(data.toString().trim());
      });
    });
    answers.push(answer);
  }

  const [appName, appSlug, bundleId, expoUsername, projectId] = answers;

  // Update app.json
  const appJsonPath = join(process.cwd(), "app.json");
  const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));

  appJson.expo.name = appName;
  appJson.expo.slug = appSlug;
  appJson.expo.ios.bundleIdentifier = bundleId;
  appJson.expo.android.package = bundleId;
  appJson.expo.owner = expoUsername;
  if (projectId) {
    appJson.expo.extra.eas.projectId = projectId;
    appJson.expo.updates.url = `https://u.expo.dev/${projectId}`;
  } else {
    delete appJson.expo.extra.eas.projectId;
    delete appJson.expo.updates.url;
  }

  writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

  // Update package.json
  const packageJsonPath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  packageJson.name = appSlug;

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(
    "Setup complete! Your project has been initialized with the provided values.",
  );
}

setupProject().then(() => {
  process.exit(0);
});
