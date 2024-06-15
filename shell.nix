{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs
    nodePackages.npm
    rustc
    cargo
    go
    crystal
    mix
  ];

  shellHook = ''
    # workaround https://github.com/sbt/sbt-assembly/issues/496
    export LC_ALL=C.UTF-8
    
    export PATH="$HOME/go/bin:$HOME/.cargo/bin"

    go install github.com/codesenberg/bombardier@latest
    mix local.hex --force
    mix local.rebar --force

    cargo install --git https://github.com/tailcallhq/tailcall
  '';
}
