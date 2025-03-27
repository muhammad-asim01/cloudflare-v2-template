import { BeatLoader } from 'react-spinners';
import classes from "@/styles/button.module.scss";

const Button = (props: any) => {
  const {
    className = '',
    buttonType = '',
    label = '',
    loading = false,
    ...remainProps
  } = props;

  const mainClass = classes.button;

  return (
    <button
      className={`${mainClass} ${className} ${mainClass}--${buttonType}`}
      {...remainProps}
      disabled={loading}
    >
      {loading ? (
        <span className={`${mainClass}__loading`}>
          <BeatLoader color={'white'} size={10} />
        </span>
      ) : `${label}`
      }
    </button>
  );
};

export default Button;
