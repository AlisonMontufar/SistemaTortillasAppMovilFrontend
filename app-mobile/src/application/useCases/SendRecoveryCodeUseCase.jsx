export default class SendRecoveryCodeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    return await this.userRepository.sendRecoveryCode(email);
  }
}
