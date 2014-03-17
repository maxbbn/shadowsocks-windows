if (process.env.HOME) {
    process.chdir(process.env.HOME);
}

require('shadowsocks/lib/shadowsocks/local').main();