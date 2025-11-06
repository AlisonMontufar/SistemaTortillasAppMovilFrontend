export default class OrderDetailUseCase {
  constructor(homeRepository) {
    this.homeRepository = homeRepository;
  }

  async execute(IdEnterprise) {
    return await this.homeRepository.OrdersEnterprises(IdEnterprise);
  }
}
