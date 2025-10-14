export default class RecoverPasswordRepository {
  async sendRecoveryCode(email) {
    throw new Error('Method not implemented');
  }
 async sendPasswordResetConfirmation(email) {
    throw new Error('Method not implemented');
  }

  async verifyRecoveryCode(email, code) {
    throw new Error('Method not implemented');
  }

  async resetPassword(email, newPassword, confirmPassword) {
    throw new Error('Method not implemented');
  }
}
