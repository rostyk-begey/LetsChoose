describe('client-components: ContestCardSkeleton component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=contestcardskeleton--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to ContestCardSkeleton!');
  });
});
