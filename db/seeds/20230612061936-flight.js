'use strict';

/** @type {import('sequelize-cli').Migration} */

const flight = [
  {
    airline_id: 3,
    airport_id: 1,
    departure_date: "2023-09-12T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-12T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Jakarta",
    to: "Bali",
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 3,
    airport_id: 1,
    departure_date: "2023-09-12T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-10-12T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Jakarta",
    to: "Bali",
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 1,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Jakarta",
    to: "Bali",
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Jakarta",
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 6 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Jakarta",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-14T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-14T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Jakarta",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-14T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-14T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Jakarta",
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Jakarta",
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 3,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Medan",
    to: "Bali",
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 3,
    departure_date: "2023-09-13T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-13T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Medan",
    to: "Bali",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 3,
    departure_date: "2023-09-14T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-14T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Medan",
    to: "Bali",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-14T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-14T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Surabaya",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-15T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-15T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Surabaya",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id: 6,
    departure_date: "2023-09-14T00:00:00.000Z",
    departure_time: "08:00:00",
    arrival_date: "2023-09-14T00:00:00.000Z",
    arrival_time: "11:00:00",
    from: "Bali",
    to: "Surabaya",
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },

];


module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Flights", flight, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete("Flights", null, {});
  }
};
