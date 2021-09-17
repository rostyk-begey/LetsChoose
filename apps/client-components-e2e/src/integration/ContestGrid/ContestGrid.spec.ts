describe('client-components: ContestGrid component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=contestgrid--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ContestGrid!');
    });
});
