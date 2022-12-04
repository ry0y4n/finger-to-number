# Finger-to-Number

MediaPipeの手指形状検出を用いて，二進数を表現した手を認識して計算結果を表示してくれるシステム

### 使用方法

1. コードをクローンまたはダウンロードする

    ```
    git clone https://github.com/ry0y4n/finger-to-number.git
    ```

2. Visual Studio Codeの拡張機能「[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)」を使うか，ターミナル・コマンドプロンプトにて，下記の各種環境に応じたコマンドを実行する

    ```
    # python 2.X
    $ python -m SimpleHTTPServer 8080

    # python 3.X
    $ python -m http.server 8080

    # ruby
    $ ruby -run -e httpd . -p 8080

    # php
    $ php -S localhost:8080
    ```
