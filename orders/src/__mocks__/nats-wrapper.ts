const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, msg: any, cb: () => void) => {
        cb();
      }),
  },
};

export default natsWrapper;
