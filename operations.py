from sqlalchemy.orm import Session
from hashing import hashed_password, verify_password
from fastapi import Depends,HTTPException
import jwt 
import re
from flask import request



def user_login(username,password):
    pass



import mysql.connector

def _get_database_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="myntra_database"
    )
    return connection

class Database:
    def get_all_users(self):
        return_dict = {}
        _connection = _get_database_connection()
        try:
            cursor = _connection.cursor()
            cursor.execute('SELECT * FROM user')
            results = cursor.fetchall()
            cursor.close()
            _connection.commit()
            _connection.close()
            return_dict = {'success': True, 'data': results}
        except Exception as e:
            return_dict = {'success': False, 'msg': str(e)}
        finally:
            _connection.close()
        return return_dict
    
    def get_product_count(self):
        return_dict = {}
        _connection = _get_database_connection()
        try:
            cursor = _connection.cursor()
            cursor.execute('SELECT count(id) FROM products')
            results = cursor.fetchall()
            cursor.close()
            _connection.commit()
            _connection.close()
            return_dict = {'success': True, 'data': results}
        except Exception as e:
            return_dict = {'success': False, 'msg': str(e)}
        finally:
            _connection.close()
        return return_dict
    
    '''This method allows you to perform crud by just passing query and parameters'''
    def database_operation(self, query_data):
            return_dict = {}
            _connection = _get_database_connection()
            try:
                _cursor = _connection.cursor()
                query, params = query_data
                _cursor.execute(query, params)
                results = _cursor.fetchall()
                _connection.commit()  # Commit the transaction
                # print(results, "********************results***********database**********")
                return_dict = {'success': True, 'data': results}
            except Exception as e:
                print(f"Error occurred: {e}")
                return_dict = {'success': False, 'msg': str(e)}
            finally:
                if _connection and _connection.is_connected():
                    _cursor.close()
                    _connection.close()
            return return_dict

    



