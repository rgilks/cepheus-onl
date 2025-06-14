# Setting Up Your Development Environment

This guide will walk you through setting up the project from scratch. Don't worry if you're new to this; we'll go step-by-step.

## What You'll Need

Before we start, make sure you have the following installed on your computer:

- **Node.js:** This is a JavaScript runtime that lets you run the project. We recommend using the latest Long-Term Support (LTS) version. You can download it from [nodejs.org](https://nodejs.org/).
- **Git:** This is the version control system we use to manage our code. You can download it from [git-scm.com](https://git-scm.com/).
- **An AWS Account:** Our project uses AWS Amplify for the backend and hosting. If you don't have an account yet, you can create one for free at [aws.amazon.com](https://aws.amazon.com/).
- **A GitHub Account:** You'll need this to get the code and contribute. You can sign up at [github.com](https://github.com/).

## Step 1: Get the Project Code

First, you need to get a copy of the project code onto your computer.

1.  **Fork the Repository:** A "fork" is your own personal copy of the project on GitHub. Go to the main project repository on GitHub and click the "Fork" button in the top-right corner.

2.  **Clone Your Fork:** Now, you'll download that copy to your computer. Open your terminal (like Command Prompt, PowerShell, or Terminal on a Mac) and run the following command. Make sure to replace `<your-github-username>` with your actual GitHub username.

    ```bash
    # This command downloads the code to a new folder on your computer
    git clone [https://github.com/](https://github.com/)<your-github-username>/<project-name>.git
    ```

3.  **Navigate into the Project Directory:** Once it's downloaded, move into the new project folder.

    ```bash
    # "cd" stands for "change directory"
    cd <project-name>
    ```

## Step 2: Set Up Your Local Environment

Now that you have the code, let's get it running locally.

1.  **Install Dependencies:** Our project uses several helper libraries, called dependencies. You can install all of them with a single command.

    ```bash
    # This reads the package.json file and installs everything the project needs
    npm install
    ```

2.  **Run the Development Server:** This command will start a local server so you can see the application in your web browser.

    ```bash
    # This starts the Next.js application
    npm run dev
    ```

3.  **See it Live!** Open your web browser and go to [http://localhost:3000](http://localhost:3000). You should see the homepage of the application!

Great job! The front-end is now running on your machine. Next, we'll set up the backend.

## Step 3: Create Your Own Backend with Amplify

Our project uses AWS Amplify for its backend (things like user accounts, databases, etc.). You'll create your own separate backend environment for development. This is called a "sandbox," and it's a safe place for you to experiment without affecting anyone else.

1.  **Initialize Amplify:** This command connects your local project to your AWS account and sets up the necessary backend files.

    ```bash
    # This command might ask you to log in to your AWS account
    npx create-amplify@latest
    ```

    Follow the on-screen prompts. This will create a new `amplify` folder in your project.

2.  **Start the Sandbox:** This command creates and deploys a development version of the backend just for you.

    ```bash
    # This might take a few minutes the first time you run it
    npx amplify sandbox
    ```

    This command will watch for any changes you make in the `amplify` folder and update your cloud backend automatically. You can now develop new features that use the backend!

## Step 4: Connect to Amplify Hosting (Optional, but Recommended)

This step sets up automatic deployments. Whenever you push changes to your GitHub repository, Amplify will automatically build and host your application.

1.  **Log in to AWS:** Open your web browser and log in to the [AWS Management Console](https://aws.amazon.com/).
2.  **Go to AWS Amplify:** Use the search bar at the top to find and navigate to the "AWS Amplify" service.
3.  **Host a Web App:**
    - Click on **"New app"** and then **"Host web app"**.
    - Choose **GitHub** as your provider and follow the steps to authorize Amplify to access your repositories.
    - Select your forked repository (e.g., `<your-github-username>/<project-name>`) and choose the `main` branch.
    - Click **"Next"**.
4.  **Confirm Build Settings:** Amplify is smart and should detect all the correct settings automatically. You can just look them over and click **"Next"**.
5.  **Save and Deploy:** Review your settings one last time and click **"Save and deploy"**.

And that's it! Amplify will now deploy your site. After the first deployment is finished, any time you push a change to your `main` branch on GitHub, a new version of the site will be built and deployed automatically.

You have now successfully set up your complete development environment.
