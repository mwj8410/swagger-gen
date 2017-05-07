module.exports = {

  /**
   * @swagger
   * /test:
   *   get:
   *     description: a test
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *       403:
   *         description: Unauthorized
   *     tags:
   *       - Example
   */

  get: () => {
    return 'test';
  },

  /**
   * @swagger
   * /test/here:
   *   put:
   *     description: a test
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *       403:
   *         description: Unauthorized
   *     tags:
   *       - Example
   */

  put: () => {
    return 'test';
  }

};
