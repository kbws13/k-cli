#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";
import fs from "fs-extra";
import { program } from "commander";
import {table} from "table";
import initAction from "./initAction.js";
import logSymbols from "./logSymbols.js";
import {templates} from "./constants.js";
import clone from "./gitClone.js";

const pkg = fs.readJSONSync(new URL("./package.json", import.meta.url));
program.version(pkg.version, "-v", "--version");

program
    .name("k-cli")
    .description("一个简单的脚手架工具")
    .usage("<command> [options]")
    .on("--help", () => {
        console.log(
            "\r\n" +
            chalk.greenBright.bold(
                figlet.textSync("k-cli", {
                    font: "Standard",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true,
                })
            )
        );

        console.log(
            `\r\nRun ${chalk.cyan(
                `k-cli <command> --help`
            )} for detailed usage of given command\r\n`
        );
    });

program
    .command("create <project-name>")
    .description("创建一个新项目")
    .option("-t --template [template]", "输入模板名称创建项目")
    .option("-f --force", "强制覆盖本地同名项目")
    .option("-i --ignore", "忽略项目相关描述, 快速创建项目")
    .action(initAction)

program
    .command("list")
    .description("查看所有可用的模板")
    .action(() => {

        const data = templates.map(item => [chalk.greenBright(item.name), chalk.blueBright(item.value), chalk.blueBright(item.desc)]);

        data.unshift([chalk.yellowBright("模板名称"), chalk.yellowBright("模板地址"), chalk.yellowBright("模板描述")]);

        const config = {
            header: {
                alignment: 'center',
                content: chalk.yellowBright(logSymbols.star, '所有可用的模板'),
            },
        }
        console.log(table(data, config));
    })

program.parse(process.argv);
