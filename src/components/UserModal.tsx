import { DatePicker, Form, Input, InputNumber, Modal, Row } from "antd";
import { User } from "../types";
import { useForm } from "antd/es/form/Form";
import {useCallback, useEffect} from "react";
import dayjs from "dayjs";

interface Props {
  onCancel: () => void;
  visible: boolean;
  onOk: (data: User) => void;
  user?: User;
}

export const UserModal = ({ onCancel, visible, onOk, user }: Props) => {
  const [form] = useForm<User>();

  const onSubmit = useCallback(async () => {
    try {
      const result = await form.validateFields();
      onOk({ ...user, ...result });
      form.resetFields();
    } catch (errInfo) {
      console.log("Failed:", errInfo);
    }
  }, [form, onOk, user]);

  useEffect(() => {
    // form initialization
    if(user) {
      form.setFieldsValue(user);
    }
  }, [user])

  return (
    <Modal
      destroyOnClose
      title="Заполните данные"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={onSubmit}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        validateTrigger="onChange"
        className="margin-top-lg"
        form={form}
      >
        <Form.Item
          label="Имя"
          name={"name"}
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Input  />
        </Form.Item>
        <Form.Item
          label="Дата рождения"
          name={"birthday"}
          rules={[{ required: true, message: "Обязательное поле" }]}
        >
          <Row style={{ width: "100%" }}>
            <DatePicker
              defaultValue={user?.birthday ? dayjs(user?.birthday) : undefined}
              style={{ width: "100%" }}
              onChange={(date) =>
                form.setFieldValue("birthday", date?.format("YYYY-MM-DD"))
              }
            />
          </Row>
        </Form.Item>
        <Form.Item
          rules={[
            { required: true, message: "Обязательное поле" },
            {
              validator(_, value) {
                if (value > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Значение должно быть больше нуля")
                );
              }
            }
          ]}
          label="Рейтинг"
          name={"rating"}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
