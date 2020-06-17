import React from "react"
import { Col, Row } from "react-bootstrap"
import { Header } from "./Header"

export const About = () => (
  <div>
    <Header header="О сайте" subHeader=" " />
    <Row>
      <Col sm={1}> </Col>
      <Col sm={10}>
        <h3>
          Сайт разработан с применением самых модных (клиент) и проверенных временем
          (сервер) технологий
        </h3>
      </Col>
      <Col sm={1}> </Col>
    </Row>
    <Row>
      <Col sm={1}>{""}</Col>
      <Col sm={5}>
        <h4>Клиент на JavaScript</h4>
        <ul>
          <li>React</li>
          <li>Redux</li>
          <li>Bootstrap</li>
        </ul>
      </Col>
      <Col sm={5}>
        <h4>Сервер на Python</h4>
        <ul>
          <li>Django, Django REST Framework</li>
          <li>Requests, BeautifulSoup, Openpyxl</li>
          <li>PostgreSQL</li>
        </ul>
      </Col>
      <Col sm={1}>{""}</Col>
    </Row>

    <Row>
      <Col sm={1}>{""}</Col>
      <Col sm={10}>
        <h3>Последние изменения</h3>
        <p>
          <strong>[v2.5.1 от 2020.06.17]</strong> - Теперь, помимо самих экзаменов, на
          сайт загружаются списки на апробации.
        </p>
        <p>
          <strong>[v2.5.0 от 2020.06.08]</strong> - Традиционное обновление перед
          началом экзаменов. Обновлены версии большинства компонентов клиента и сервера.
          База очищена от неактуальных данных.
        </p>
        <p>
          <strong>[v2.4.1 от 2019.06.09]</strong> - Дата экзамена теперь берется из
          HTML, а не из файла. Иногда в РЦОИ могут накосячить и вместо июня в первой
          строке файла оказывается май.
        </p>
        <p>
          <strong>[v2.4.0 от 2019.06.03]</strong> - На сервере обновлены версии Python,
          Django и пакетов. Восстановлена работа парсера. База очищена от неактуальных
          данных 2018 года.
        </p>
        <p>
          <strong>[v2.3.2 от 2019.06.02]</strong> - Косметические изменения в текстах.
        </p>
        <p>
          <strong>[v2.3.1 от 2018.06.03]</strong> - Панель «Отказ от ответственности»
          всегда отображается на всех страницах.
        </p>
        <p>
          <strong>[v2.3.0 от 2018.05.26]</strong> - Восстановлена работа парсера, база
          очищена от неактуальных данных и, соответственно, все подписки удалены.
        </p>
        <p>
          <strong>[v2.2.4 от 2017.09.01]</strong> - Добавлен Дополнительный период ГИА,
          исправлены ошибки.
        </p>
        <p>
          <strong>[v2.2.3 от 2017.06.15]</strong> - Исправлена ошибка в функции
          обновления, когда в один день одновременно проходят экзамены 9 и 11 классов
          (19 июня, например).
        </p>
        <p>
          <strong>[v2.2.2 от 2017.06.13]</strong> - Чем дальше от начала ГИА, тем больше
          нужно было прокручивать выпадающий список дат на странице "Экзамены". Теперь
          даты сортируются в обратном порядке.
        </p>
        <p>
          <strong>[v2.2.1 от 2017.06.08]</strong> - Ограничено максимальное число
          подписок для одного аккаунта - 100
        </p>
        <p>
          <strong>[v2.2.0 от 2017.06.07]</strong> - Новая функция: подписка на
          уведомления о новых добавленных экзаменах
        </p>
        <p>
          <strong>[v2.1.0 от 2017.06.01]</strong> - Новая функция: регистрация и
          авторизация
        </p>
        <p>
          <strong>[v2.0.2 от 2017.05.28]</strong> - Функция обновледния БД стала умнее и
          теперь сравнивает заголовок Last-Modified каждого файла, чтобы не грузить то,
          что уже было загружено.
        </p>
        <p>
          <strong>[v2.0.1 от 2017.05.26]</strong> - РЦОИ внезапно выкатил новую версию
          сайта. Если раньше ссылки на все файлы были на одной странице, то теперь их
          спрятали в отдельные всплывающие окна на каждый экзаменационный день, которые
          получаются через POST-запрос. Хорошо, что никакой авторизации и волшебных
          кукисов еще не сделали. С точки зрения простого пользователя получить
          информацию о распределении в ППЭ стало еще на клик сложнее.
        </p>
        <p>
          <strong>[v2.0.0 от 2017.05.17]</strong> - Обновление перед началом основного
          периода 2016/2017:
        </p>
        <ul>
          <li>
            На сервере актуальные версии PostgreSQL, Python, django и других пакетов
          </li>
          <ul>
            <li>Обновлен парсер excel-файлов</li>
            <li>Обновлена функция загрузки данных в БД</li>
            <li>Добавлена функция автозапуска обновления каждый час</li>
            <li>Добавлен алгоритм сжатия brotli для статики и ответов сервера</li>
          </ul>
          <li>
            На клиенте актуальные версии React, redux, react-router и других пакетов
          </li>
          <ul>
            <li>Оптимизирована мобильная версия</li>
          </ul>
        </ul>
      </Col>
      <Col sm={1}>{""}</Col>
    </Row>

    <Row>
      <Col sm={1}>{""}</Col>
      <Col sm={10}>
        <h3>История создания</h3>
        <p>
          С началом основного этапа ГИА в 2016 году мне, как ответственному за
          информационное обеспечение ГИА и взаимодействие с РЦОИ в Центре образования №
          1858, нужно было ежедневно отслеживать распределение сотрудников в пункты
          проведения эказменов. Эта информация доступна на сайте РЦОИ в виде
          excel-файлов на каждый экзаменационный день. Очевидно, что такое представление
          неудобно для конечного пользователя. Чтобы узнать все дни, когда сотрудники
          школы будут работать в ППЭ, нужно:
        </p>
        <ol>
          <li>Скачать каждый файл</li>
          <li>Открыть каждый файл</li>
          <li>Отфильтровать каждый файл</li>
        </ol>
        <p>
          Общее количество файлов (ОГЭ, ЕГЭ, ГВЭ) - 42. Можно убрать ГВЭ, так как
          сотрудники моей школы там точно не являются организаторами. Остается 25
          файлов, но и это слишком много для того, чтобы каждый день проводить эти
          манипуляции, потому что информация в них ежедневно обновляется.
        </p>
        <h4>Задача: сделать доступ к информации РЦОИ удобным</h4>
        <p>
          <strong>[v0.1]</strong> На языке Python с использованием библиотек Requests,
          BeautifulSoup, Openpyxl я сделал загрузку всех файлов с последующим
          объединением в один большой csv-файл - простое решение для личного
          использования. Далее я решил превратить эту задачу по автоматизации в
          полноценный учебный проект и сделать веб-интерфейс.
        </p>
        <p>
          <strong>[v0.2]</strong> Выбрал связку Django и PostgreSQL, так как раньше уже
          использовал её для похожей задачи, когда выбирал Li-Po батарейки для
          квадрокоптера на российском складе магазина HobbyKing. Хранить данные я решил
          в нормальной форме, для этого разделил их на отдельные таблицы: Date, Level,
          Position, Organisation, Territory, Place, Employee и сводная таблица Exam,
          которая содержит только ключи. Первая проблема - объем данных, 230k строк.
          Последовательная загрузка через ORM Django сильно нагружала систему и
          выполнялась 3 часа. Решение для пакетной загрузки в пустую БД:{" "}
          <a href="http://initd.org/psycopg/docs/cursor.html#cursor.copy_from">
            cursor.copy_from
          </a>
          . Для добавления новых записей без сравнения с существующими применил команду{" "}
          <code>INSERT ... ON CONFLICT ... DO UPDATE</code>, доступную в PostreSQL 9.5.
          Запускается через{" "}
          <a href="http://initd.org/psycopg/docs/cursor.html#cursor.execute">
            cursor.execute
          </a>
          .
        </p>
        <p>
          <strong>[v0.3]</strong> Далее я решил изучить какую-нибудь модную
          js-библиотеку для создания интерфейса и выбрал React. В Django добавил API с
          помощью REST Framework, прочитал 100500 инструкций по реакту и в итоге...
          получился этот сайт.
        </p>
      </Col>
      <Col sm={1}>{""}</Col>
    </Row>
  </div>
)

export default About
