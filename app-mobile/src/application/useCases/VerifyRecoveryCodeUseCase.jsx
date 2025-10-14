export default class VerifyRecoveryCodeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, code) {
    return await this.userRepository.verifyRecoveryCode(email, code);
  }
}
