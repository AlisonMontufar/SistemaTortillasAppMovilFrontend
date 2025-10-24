export default class ResetPasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, newPassword, confirmPassword) {
    return await this.userRepository.resetPassword(email, newPassword, confirmPassword);
  }
}
