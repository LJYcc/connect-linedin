'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Input } from 'antd'
import { sendMessage, login } from '@/utils/requestUrl'
import { message } from 'antd'

import styles from './home.module.css'

const Home = ({ anonLinkInstance }: { anonLinkInstance: any }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [form] = Form.useForm()

  const open = () => {
    login().then(res => {
      if (res.status === 'active') {
        setIsLogin(true)
      } else {
        anonLinkInstance.open()
      }
    })
  }

  const handleRunScript = (type: string, value?: any) => {
    switch (type) {
      case 'send-message':
        setIsSending(true)
        setIsFormModalOpen(false)
        sendMessage(value)
          .then(res => {
            message.success('Message sent successfully')
            setIsSending(false)
          })
          .catch(() => setIsSending(false))

        break
      case 'send-connection-request':
        // sendConnectionRequest()
        break
      default:
        break
    }
  }

  return (
    <>
      <main className={styles.main}>
        <section className={styles.section}>
          <label>connect-linkedin: </label>
          <Button className={styles.button} onClick={open}>
            connect
          </Button>
        </section>

        {isLogin && (
          <>
            <section className={styles.section}>
              <label>Send Message: </label>
              <Button
                loading={isSending}
                className={styles.button}
                onClick={() => setIsFormModalOpen(true)}
              >
                Send Message
              </Button>
            </section>

            {/* <section className={styles.section}>
              <label>Send Connection: </label>
              <Button
                className={styles.button}
                onClick={() => handleRunScript('send-connection-request')}
              >
                Send Connection
              </Button>
            </section> */}
          </>
        )}
      </main>

      <Modal
        title="Form Data"
        open={isFormModalOpen}
        footer={null}
        onCancel={() => setIsFormModalOpen(false)}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <Form
          labelCol={{ span: 5 }}
          form={form}
          onFinish={values => handleRunScript('send-message', values)}
        >
          <Form.Item
            label="Profile URL"
            name="profileUrl"
            rules={[
              {
                required: true,
                message: 'Please input your linkedin profile URL'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[
              {
                required: true,
                message: 'Please enter the message to be sent'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

Home.propTypes = {
  anonLinkInstance: PropTypes.object
}

export default Home
