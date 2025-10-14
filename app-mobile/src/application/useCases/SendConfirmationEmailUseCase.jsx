export default class SendConfirmationEmailUseCase  {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email) {
    return await this.userRepository.sendPasswordResetConfirmation(email);
  }
}
