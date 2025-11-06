export default class UpdateStatusUseCase {
 constructor(homeRepository) {
    this.homeRepository = homeRepository;
  }

  async execute(idPedido, estatusDetalle) {
    return await this.homeRepository.UpdateStatus(idPedido, estatusDetalle);
  }
}
