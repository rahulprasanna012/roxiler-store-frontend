const Store = require('../models/Store');

class StoreService {
  static async createStore(storeData) {
    try {
      const store = await Store.create(storeData);
      return store;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw { 
          status: 409, 
          message: 'Store with this email already exists',
          code: 'STORE_EMAIL_CONFLICT'
        };
      }
      throw {
        status: 500,
        message: 'Failed to create store',
        code: 'STORE_CREATION_FAILED',
        error: error.message
      };
    }
  }

  static async getStores(filters = {}, pagination = {}) {
    try {
      const stores = await Store.getAllStores(filters, pagination);
      return stores;
    } catch (error) {
      throw {
        status: 500,
        message: 'Failed to fetch stores',
        code: 'STORE_FETCH_FAILED',
        error: error.message
      };
    }
  }

  static async getStore(id, withRatings = false) {
    try {
      const store = await Store.getStoreById(id, withRatings);
      if (!store) {
        throw {
          status: 404,
          message: 'Store not found',
          code: 'STORE_NOT_FOUND'
        };
      }
      return store;
    } catch (error) {
      if (error.code === 'STORE_NOT_FOUND') throw error;
      throw {
        status: 500,
        message: 'Failed to fetch store',
        code: 'STORE_FETCH_FAILED',
        error: error.message
      };
    }
  }

  static async updateStore(id, updateData) {
    try {
      const store = await Store.updateStore(id, updateData);
      if (!store) {
        throw {
          status: 404,
          message: 'Store not found',
          code: 'STORE_NOT_FOUND'
        };
      }
      return store;
    } catch (error) {
      if (error.code === 'STORE_NOT_FOUND') throw error;
      if (error.code === '23505') {
        throw {
          status: 409,
          message: 'Store with this email already exists',
          code: 'STORE_EMAIL_CONFLICT'
        };
      }
      throw {
        status: 500,
        message: 'Failed to update store',
        code: 'STORE_UPDATE_FAILED',
        error: error.message
      };
    }
  }

  static async deleteStore(id) {
    try {
      const deleted = await Store.deleteStore(id);
      if (!deleted) {
        throw {
          status: 404,
          message: 'Store not found',
          code: 'STORE_NOT_FOUND'
        };
      }
      return deleted;
    } catch (error) {
      if (error.code === 'STORE_NOT_FOUND') throw error;
      throw {
        status: 500,
        message: 'Failed to delete store',
        code: 'STORE_DELETION_FAILED',
        error: error.message
      };
    }
  }
}

module.exports = StoreService;