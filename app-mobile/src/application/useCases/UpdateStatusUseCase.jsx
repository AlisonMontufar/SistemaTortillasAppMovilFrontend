export default class UpdateStatusUseCase {
 constructor(homeRepository) {
    this.homeRepository = homeRepository;
  }

  async execute(id, estatusDetalle) {
    return await this.homeRepository.UpdateStatus(id, estatusDetalle);
  }
}
