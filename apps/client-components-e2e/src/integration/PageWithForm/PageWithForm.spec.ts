describe('client-components: PageWithForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=pagewithform--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to PageWithForm!');
  });
});
