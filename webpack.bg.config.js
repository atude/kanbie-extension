module.exports = [
  {
    output: {
			path: __dirname + "/build",
      filename: './background.js',
    },
    entry: './src/background.js',
    mode: 'production',
  },
];