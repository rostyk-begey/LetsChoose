describe('client-components: ContestCard component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=contestcard--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ContestCard!');
    });
});
