/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import user from '@testing-library/user-event';
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should return new bill form", async () => {
      document.body.innerHTML = NewBillUI()
      await waitFor(() => screen.getByTestId('form-new-bill'))
      await waitFor(() => screen.getByTestId('expense-type'))
      await waitFor(() => screen.getByTestId('expense-name'))
      await waitFor(() => screen.getByTestId('datepicker'))
      await waitFor(() => screen.getByTestId('amount'))
      await waitFor(() => screen.getByTestId('vat'))
      await waitFor(() => screen.getByTestId('pct'))
      await waitFor(() => screen.getByTestId('commentary'))
      await waitFor(() => screen.getByTestId('file'))
    })
    test("then i can submit a file", async () => {
      const someValues = [{ name: 'teresa teng' }];
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
      const newbillContainer = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      newbillContainer.store.bills = jest.fn(newbillContainer.store.bills)
      const str = JSON.stringify(someValues);
      const blob = new Blob([str]);
      const file = new File([blob], 'values.jpeg', {
        type: 'image/jpeg',
      });
      const input = screen.getByTestId('file');
      user.upload(input, file);
      expect(newbillContainer.store.bills).toHaveBeenCalled()
    })

    test("then i can submit form", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
      const newbillContainer = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      newbillContainer.updateBill = jest.fn()
      document.getElementById('btn-send-bill').click()
      expect(newbillContainer.updateBill).toHaveBeenCalled()
    })

  })
})
