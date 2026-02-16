{ pkgs }: {
  packages = [
    pkgs.nodejs-18_x,
    pkgs.nodePackages.npm
  ];
}