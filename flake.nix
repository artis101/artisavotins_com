{
  description = "artisavotins.com rust nixos development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, rust-overlay, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        rustVersion = pkgs.rust-bin.stable.latest.default;
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            rustVersion
            cargo
            rustc
            rustfmt
            rust-analyzer
            clippy
            cargo-watch
          ];
        };
      }
    );
}
