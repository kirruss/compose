/* eslint-disable import/no-commonjs */
const { resolve } = require("path")

const tsNode = require("ts-node")

const project = resolve(__dirname, "./tsconfig.test.json")

tsNode.register({ project })
