module.exports = {
  apps: [
    {
      name: "crypto-tax",
      script: "npm",
      args: "start",
      exec_mode: "cluster",
      instances: "max",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "ec2-13-115-214-1.ap-northeast-1.compute.amazonaws.com",
      key: "../_deployment/ec2_umu.to.pem",
      ref: "origin/master",
      repo: "git@github.com:umutto/crypto-tax.git",
      path: "/home/ubuntu/projects/crypto-tax",
      "post-deploy": "npm ci && npm run build && pm2 startOrRestart ecosystem.config.js",
    },
  },
};
