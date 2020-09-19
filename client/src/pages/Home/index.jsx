import React, { useState } from 'react';
import { Page as TablerPage, Grid, Form, Loader } from 'tabler-react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import InfiniteScroll from 'react-infinite-scroller';

import Page from 'app/components/Page';
import ContestCard from 'app/components/ContestCard';
import { useContestAllInfinite } from 'app/hooks/api/contest';
import useGetParams from 'app/hooks/getParams';
import ROUTES from 'app/utils/routes';

const SORT_OPTIONS = {
  POPULAR: 'POPULAR',
  NEWEST: 'NEWEST',
};

const HomePage = () => {
  const baseClassName = 'home-page';
  const { params, handleSearch, onInputChange } = useGetParams(ROUTES.HOME, {
    search: '',
    sortBy: SORT_OPTIONS.POPULAR,
  });
  const { data, fetchMore, canFetchMore, isSuccess } = useContestAllInfinite(
    params,
  );

  const [isScrolled, setIsScrolled] = useState(false);
  useScrollPosition(
    ({ currPos }) => {
      const isShow = currPos.y < 0;
      if (isShow !== isScrolled) setIsScrolled(isShow);
    },
    [isScrolled],
  );

  return (
    <Page
      isPrivate
      navbarBefore={
        <Grid.Col lg={5} className="ml-auto mt-4 mt-lg-0" ignoreCol>
          <div className="page-options d-flex">
            <Form.SelectGroup className="mr-2" canSelectMultiple={false}>
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Popular"
                value={SORT_OPTIONS.POPULAR}
                checked={params.sortBy === SORT_OPTIONS.POPULAR}
                onChange={onInputChange}
                name="sortBy"
              />
              <Form.SelectGroupItem
                className="mb-0"
                type="radio"
                label="Newest"
                value={SORT_OPTIONS.NEWEST}
                checked={params.sortBy === SORT_OPTIONS.NEWEST}
                onChange={onInputChange}
                name="sortBy"
              />
            </Form.SelectGroup>
            <div className="input-icon">
              <input
                name="search"
                className="form-control"
                type="text"
                placeholder="Search for..."
                defaultValue={params.search}
                onChange={handleSearch}
              />
              <span className="input-icon-addon">
                <i className="fe fe-search" />
              </span>
            </div>
          </div>
        </Grid.Col>
      }
    >
      <TablerPage.Content className={`${baseClassName}__content`}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchMore()}
          hasMore={canFetchMore}
          loader={
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          }
        >
          <Grid.Row>
            {isSuccess &&
              data?.map(({ data: { contests } }) =>
                contests.map((contest) => (
                  <Grid.Col width={12} md={6} lg={4} key={contest._id}>
                    <ContestCard data={contest} />
                  </Grid.Col>
                )),
              )}
          </Grid.Row>
        </InfiniteScroll>
        {/*<div className="lorem">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
            architecto autem cum dolor dolorem eaque, exercitationem facere
            facilis incidunt inventore ipsum iusto nulla omnis quasi repellendus
            tempora tenetur, ut vero?
          </div>
          <div>
            Accusantium consectetur corporis cumque eius error ex harum illum
            ipsa maxime mollitia nostrum officiis praesentium, provident quas
            quisquam reprehenderit sed velit voluptates. Ab assumenda corporis
            ducimus modi qui sunt voluptatibus.
          </div>
          <div>
            Aliquam aspernatur at autem commodi cupiditate dicta laborum, neque?
            Ad alias animi architecto commodi corporis exercitationem illum iste
            itaque iure laboriosam, nobis rerum soluta totam ullam veniam
            veritatis voluptatem? Vel?
          </div>
          <div>
            Alias aliquid cum error excepturi incidunt, iste maxime molestiae
            nisi nulla odio perferendis quia recusandae tempore totam velit?
            Accusamus aperiam distinctio dolor eius explicabo fuga maxime
            quibusdam quis repudiandae unde.
          </div>
          <div>
            Aliquam aperiam aspernatur culpa, deserunt doloremque ducimus eaque
            eos esse est expedita fugiat in ipsam minus mollitia necessitatibus
            nesciunt optio pariatur porro quaerat quas quia quo, saepe
            temporibus veniam voluptatibus!
          </div>
          <div>
            Delectus facilis modi necessitatibus nisi quas tempora, voluptas?
            Alias aliquid atque consequatur doloribus ducimus ea earum error et
            eveniet facere ipsum itaque mollitia, nemo nihil perferendis quaerat
            quod reprehenderit soluta.
          </div>
          <div>
            Aliquid beatae deleniti, dicta maxime optio ullam vero? Architecto
            cupiditate deserunt, distinctio ea eius enim impedit ipsam iure
            laborum maxime, nobis officiis qui quia quibusdam sapiente tenetur,
            ullam voluptas voluptates.
          </div>
          <div>
            Accusamus aperiam beatae blanditiis deleniti doloribus eos, esse est
            ex excepturi facere fuga harum incidunt ipsum laborum nihil officiis
            quo reprehenderit tempora velit vero! Corporis cumque ipsam optio
            reprehenderit tempora.
          </div>
          <div>
            A at blanditiis, culpa cum delectus doloremque iusto libero
            necessitatibus numquam officiis, perspiciatis sequi ut, voluptatem?
            Aperiam commodi dolores eligendi inventore laborum nisi nostrum
            pariatur, perferendis quasi qui quia sint.
          </div>
          <div>
            Alias, assumenda cum deserunt distinctio dolorem enim esse eum fuga
            fugiat id incidunt iusto nostrum nulla officia, omnis ratione sunt?
            At cum ipsum molestiae quisquam repellendus. Aut laboriosam laborum
            molestiae?
          </div>
          <div>
            Aperiam debitis deleniti esse est eveniet fugit illum incidunt
            laborum, modi nam, nihil non omnis repellat sunt voluptatem! Eveniet
            fugiat hic magni optio, sapiente vel. Dignissimos eaque laborum nisi
            tempora?
          </div>
          <div>
            Assumenda facilis libero molestias omnis perspiciatis provident
            quasi sit voluptas voluptates? Accusantium consequatur debitis
            delectus deleniti dicta, dignissimos doloremque eligendi ex impedit
            ipsum laudantium maiores possimus praesentium quis quod veritatis.
          </div>
          <div>
            A accusamus accusantium asperiores illum iure magni molestias
            officia quia reiciendis vitae. Ipsa nisi repellendus tenetur?
            Delectus dicta ea nulla. Accusamus cum eius est expedita explicabo
            ratione similique totam, ullam!
          </div>
          <div>
            Accusantium animi asperiores autem debitis dicta distinctio
            doloremque dolorum explicabo fugit, illum impedit in itaque maxime
            molestiae nemo non odit perspiciatis quaerat quas quis, quisquam
            quos similique voluptatibus. Nesciunt, voluptatibus?
          </div>
          <div>
            Corporis eum eveniet incidunt minima perspiciatis possimus provident
            rem? Aliquid aspernatur aut beatae blanditiis, dolor eos ex, fuga
            fugiat fugit iste labore molestias neque numquam officiis recusandae
            rem saepe tempora.
          </div>
          <div>
            Aut blanditiis corporis ex, illo nisi quas, quod rerum, saepe
            temporibus vitae voluptate voluptatem? A amet commodi eum in ipsam
            libero quia voluptatum! Ad delectus distinctio maiores nostrum unde
            ut.
          </div>
          <div>
            Ad, asperiores autem deserunt dicta excepturi, exercitationem
            laudantium maiores maxime nam nobis non quos saepe tenetur veritatis
            voluptatem! At cupiditate est eum exercitationem nam nisi rem,
            suscipit velit. Culpa, praesentium?
          </div>
          <div>
            Accusamus asperiores aspernatur dolores doloribus ducimus explicabo
            obcaecati qui reprehenderit ut veritatis! Blanditiis cum eos, harum
            magnam nostrum sed sint voluptas? Assumenda cum ea fugiat, ipsum
            maiores minus nulla sunt.
          </div>
          <div>
            Adipisci deserunt dicta dolore est facilis fugit iure obcaecati,
            odit officiis placeat provident quae rem repellendus soluta sunt
            tempora totam, voluptates? Alias delectus enim ipsa iusto optio
            possimus provident sit.
          </div>
          <div>
            Aliquid asperiores delectus eius eos eveniet exercitationem
            inventore magni minus modi molestiae mollitia, nesciunt nisi,
            nostrum porro quis sit ullam ut. Asperiores ex illo libero
            perspiciatis repudiandae soluta suscipit, velit.
          </div>
          <div>
            Aliquid, corporis dignissimos distinctio dolor, exercitationem fuga
            laboriosam molestiae neque nobis pariatur, quae sunt tempore vel
            voluptatem voluptates? Aliquam commodi, facere harum maiores minima
            provident quis similique vel voluptatum! Qui!
          </div>
          <div>
            Alias commodi consequuntur, culpa illum magnam necessitatibus nisi
            praesentium quaerat quisquam sapiente. Aspernatur dignissimos nihil
            obcaecati quod voluptatum? Ad adipisci eaque excepturi minima nulla
            odio provident quis soluta! Debitis, laudantium!
          </div>
          <div>
            Amet ea id nulla. Ab, aliquam amet consectetur culpa, dolores enim
            error eveniet exercitationem expedita illum iste omnis pariatur
            perspiciatis placeat porro provident quidem quis quo reiciendis
            tenetur totam velit.
          </div>
          <div>
            Adipisci exercitationem facere id in nemo qui. Ad assumenda dolorum
            facere nam quibusdam reiciendis saepe. Aliquam aspernatur ea earum
            laborum modi natus provident, qui quo rem, temporibus ullam, velit
            vitae.
          </div>
          <div>
            Accusantium aut, consequatur corporis cumque debitis eos error eum
            ex incidunt ipsam ipsum magni officia quisquam? Doloremque excepturi
            iure magni quasi quidem suscipit ullam! Ab ad eos ex quidem ullam?
          </div>
          <div>
            A, accusamus adipisci aspernatur assumenda atque beatae consequuntur
            dolore esse ex facere fuga fugiat hic incidunt ipsum magnam magni
            natus nemo non nostrum numquam perferendis placeat quaerat tempore
            totam velit?
          </div>
          <div>
            Accusamus amet, asperiores corporis exercitationem impedit
            laboriosam nisi nobis non nulla officia provident ut veniam
            veritatis? Aliquid aperiam autem culpa eaque enim et, fugit illo
            incidunt, numquam quae quibusdam recusandae?
          </div>
          <div>
            Animi atque cumque ea est id ipsa minima minus modi nisi nostrum
            obcaecati omnis possimus quaerat quos, soluta? Cum dolorum eveniet
            incidunt mollitia nemo, nostrum praesentium quo sequi suscipit
            tempore!
          </div>
          <div>
            Accusantium dolor fugiat illum libero, reiciendis repudiandae sint
            sunt unde veniam voluptas! Ad deserunt dolorum est, eveniet expedita
            impedit magnam obcaecati praesentium quidem sed sit suscipit ullam
            vel veniam voluptatum.
          </div>
          <div>
            At doloremque enim exercitationem nisi reprehenderit repudiandae
            suscipit totam! Animi commodi corporis ducimus odit quae quibusdam
            repellat sequi unde ut vel. Ab architecto, enim expedita in iure
            laudantium praesentium quibusdam.
          </div>
          <div>
            Adipisci beatae consectetur consequatur deserunt dolor dolorem
            dolorum enim est, excepturi fuga, fugiat fugit hic illum ipsam ipsum
            iste iure labore laudantium obcaecati officia optio sed, sunt
            tempora ullam voluptatem.
          </div>
          <div>
            Accusamus ad animi asperiores beatae corporis debitis delectus
            dolore doloribus dolorum eaque fuga ipsa ipsam ipsum labore laborum
            minus obcaecati odio, odit pariatur quibusdam sapiente velit, vitae
            voluptate voluptatibus voluptatum?
          </div>
          <div>
            Animi est ipsum iusto laudantium, maxime nostrum officiis optio qui
            ut? Ad adipisci architecto assumenda ducimus minima mollitia quae
            quidem veniam. Eveniet harum illo libero officiis quidem quis
            temporibus vitae.
          </div>
          <div>
            Aliquid architecto at atque blanditiis consequuntur cupiditate
            debitis dignissimos doloremque ducimus earum eveniet explicabo harum
            inventore, itaque libero, molestiae nisi non officiis omnis pariatur
            perferendis repellendus sapiente, sed similique totam.
          </div>
          <div>
            A ad debitis, delectus doloribus ducimus fugiat harum illum iusto
            laudantium magni odit omnis recusandae repellat repudiandae tempore
            totam vel voluptatibus? Architecto, culpa cumque et eveniet incidunt
            magni obcaecati quasi.
          </div>
          <div>
            Accusamus blanditiis deserunt dignissimos dolorum magnam minima
            minus nesciunt quis, quisquam quo reprehenderit similique sunt
            tempore tenetur, ut voluptas voluptates. Animi assumenda facere
            harum iste numquam perferendis quibusdam quos ratione.
          </div>
          <div>
            Aliquam aperiam asperiores consequatur cumque fuga inventore placeat
            qui ratione tempore unde! Atque dignissimos illo incidunt obcaecati
            officiis possimus quae reprehenderit? Assumenda, autem dolore eaque
            fugit iste necessitatibus saepe voluptatibus?
          </div>
          <div>
            Alias, aliquid amet aperiam asperiores assumenda at atque commodi
            doloremque dolores eos fugiat incidunt inventore iste magnam nemo
            nobis pariatur placeat porro quibusdam quod reiciendis rem sapiente
            similique suscipit, tempore.
          </div>
          <div>
            Ab autem, consectetur consequatur dignissimos esse et exercitationem
            explicabo id illo incidunt ipsa ipsam necessitatibus nostrum odit
            perspiciatis porro, quam quasi quis quod ratione reiciendis sapiente
            sequi sit velit voluptas.
          </div>
          <div>
            Accusantium, atque deserunt dolorem doloremque ducimus illum in iste
            neque omnis quasi ratione sint tempore, temporibus, velit
            voluptatibus. Ad hic maxime nulla veniam. Accusamus distinctio fugit
            in modi rerum tenetur?
          </div>
          <div>
            Accusamus amet aspernatur at culpa eaque earum eligendi facere illo
            in ipsam itaque iusto, laudantium magni maxime, minima natus neque
            nostrum perferendis similique, suscipit velit veritatis voluptate.
            Aliquam, magni totam.
          </div>
          <div>
            Ad alias asperiores aut commodi consectetur cum dicta dignissimos
            doloribus eligendi et eveniet ex facere fuga hic inventore minima
            necessitatibus, neque nulla perferendis porro quae repellendus sunt
            totam vero voluptatem!
          </div>
          <div>
            Accusamus amet architecto autem commodi culpa, distinctio dolorem ea
            error eum explicabo harum impedit, magnam modi necessitatibus
            pariatur porro praesentium quasi quos recusandae repellendus unde
            vero voluptate! Ex, minus perferendis.
          </div>
          <div>
            Architecto cumque delectus, dicta, eligendi esse, fuga illum magni
            maxime minus necessitatibus nulla odio qui repudiandae sequi
            veritatis? Architecto cumque error eum facilis iusto perferendis
            quam quisquam sed! Modi, tempora.
          </div>
          <div>
            Commodi cum distinctio enim fugiat id illo ipsum mollitia, optio
            quas ratione repellat repellendus sint, temporibus totam vel veniam
            voluptas? Aut dolores magnam nam nesciunt non perferendis, quas quis
            vel.
          </div>
          <div>
            Accusantium alias debitis dicta dignissimos dolores esse
            exercitationem explicabo facilis id iste laudantium libero minima
            minus, nemo neque nesciunt nisi nulla quam quo quod recusandae
            repellat repudiandae totam vel velit!
          </div>
          <div>
            Adipisci asperiores aut consectetur, consequuntur corporis culpa
            distinctio doloremque dolores, harum incidunt libero molestias
            mollitia natus nemo nobis non tenetur velit veritatis, vero
            voluptatem? A deserunt excepturi tempora tempore voluptas.
          </div>
          <div>
            Aut id laboriosam nihil perspiciatis rem temporibus tenetur? Aperiam
            dicta enim iure ullam voluptates. Eaque quae qui, quod quos tempora
            tenetur voluptatum. Aliquam blanditiis dicta eos nulla quidem
            tempore veniam.
          </div>
          <div>
            Consectetur culpa deserunt dolorem doloremque ducimus eius
            exercitationem explicabo iste laudantium minima, officiis omnis
            optio quis rem repudiandae sed sint tenetur veniam, voluptas,
            voluptatibus! At autem cupiditate eum qui quidem.
          </div>
          <div>
            Aperiam dignissimos harum ipsum repellendus sed, sit. Ab ad animi
            asperiores impedit incidunt voluptatem. Cumque dicta doloremque esse
            maiores minima nobis quo quos rerum voluptas. At esse facere non
            tempora!
          </div>
        </div>*/}
      </TablerPage.Content>
    </Page>
  );
};

export default HomePage;
