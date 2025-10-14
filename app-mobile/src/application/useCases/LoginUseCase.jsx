export default class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(username, password) {
    return await this.userRepository.login(username, password);
  }
}
