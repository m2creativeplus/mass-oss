# IDX Nix Configuration for MASS Car Workshop
# https://developers.google.com/idx/guides/customize-idx-env

{ pkgs, ... }: {
  # Specify the Nix channel
  channel = "stable-23.11";

  # Packages to install
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.git
  ];

  # Environment variables for the workspace
  env = {
    NEXT_TELEMETRY_DISABLED = "1";
  };

  # IDE extensions to install
  idx = {
    # VSCode extensions
    extensions = [
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
      "dbaeumer.vscode-eslint"
      "prisma.prisma"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when the workspace is created
      onCreate = {
        npm-install = "npm install";
      };

      # Runs when the workspace starts
      onStart = {
        dev-server = "npm run dev";
      };
    };

    # Preview configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
