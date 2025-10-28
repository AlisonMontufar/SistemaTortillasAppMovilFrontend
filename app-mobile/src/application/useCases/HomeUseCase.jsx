export default class HomeUseCase {
  constructor(homeRepository) {
    this.homeRepository = homeRepository;
  }

  async execute() {
    return await this.homeRepository.enterprises();
  }
}
