import '@types/jest';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any> {
      mockReturnThis(): this;
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: any): this;
      mockImplementation(fn: (...args: Y) => T): this;
    }
  }
} 